import '../models/interest.dart';
import '../storage/csv_storage.dart';

class InterestRepository {
  const InterestRepository({this.storage = const CsvStorage()});

  final CsvStorage storage;

  static const String _fileName = 'interests.csv';

  Future<List<Interest>> getAllInterests() async {
    final rows = await storage.readCsv(_fileName);
    return rows.map(Interest.fromCsvRow).toList();
  }

  Future<List<Interest>> getInterestsByStaffId(int staffId) async {
    final interests = await getAllInterests();
    return interests.where((interest) => interest.staffId == staffId).toList();
  }

  Future<void> addInterest(Interest interest) async {
    final interestList = await getAllInterests();
    final nextInterest = interest.interestId > 0
        ? interest
        : interest.copyWith(
            interestId: _nextId(
              interestList.map((item) => item.interestId).toList(),
            ),
          );
    interestList.add(nextInterest);
    await _saveAll(interestList);
  }

  Future<void> updateInterest(Interest interest) async {
    final interestList = await getAllInterests();
    final index = interestList.indexWhere(
      (item) => item.interestId == interest.interestId,
    );
    if (index == -1) {
      return;
    }

    interestList[index] = interest;
    await _saveAll(interestList);
  }

  Future<void> deleteInterest(int id) async {
    final interestList = await getAllInterests();
    interestList.removeWhere((item) => item.interestId == id);
    await _saveAll(interestList);
  }

  Future<void> _saveAll(List<Interest> interests) async {
    await storage.writeCsv(
      _fileName,
      interests.map((interest) => interest.toCsvRow()).toList(),
    );
  }

  int _nextId(List<int> ids) {
    if (ids.isEmpty) {
      return 1;
    }

    return ids.reduce((maxId, id) => id > maxId ? id : maxId) + 1;
  }
}