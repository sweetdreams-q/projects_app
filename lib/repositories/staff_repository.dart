import '../models/staff.dart';
import '../storage/csv_storage.dart';

class StaffRepository {
  const StaffRepository({this.storage = const CsvStorage()});

  final CsvStorage storage;

  static const String _fileName = 'staff.csv';

  Future<List<Staff>> getAllStaff() async {
    final rows = await storage.readCsv(_fileName);
    return rows.map(Staff.fromCsvRow).toList();
  }

  Future<void> addStaff(Staff staff) async {
    final staffList = await getAllStaff();
    final nextStaff = staff.id > 0
        ? staff
        : staff.copyWith(id: _nextId(staffList.map((item) => item.id).toList()));
    staffList.add(nextStaff);
    await _saveAll(staffList);
  }

  Future<void> updateStaff(Staff staff) async {
    final staffList = await getAllStaff();
    final index = staffList.indexWhere((item) => item.id == staff.id);
    if (index == -1) {
      return;
    }

    staffList[index] = staff;
    await _saveAll(staffList);
  }

  Future<void> deleteStaff(int id) async {
    final staffList = await getAllStaff();
    staffList.removeWhere((item) => item.id == id);
    await _saveAll(staffList);
  }

  Future<void> _saveAll(List<Staff> staffList) async {
    await storage.writeCsv(
      _fileName,
      staffList.map((staff) => staff.toCsvRow()).toList(),
    );
  }

  int _nextId(List<int> ids) {
    if (ids.isEmpty) {
      return 1;
    }

    return ids.reduce((maxId, id) => id > maxId ? id : maxId) + 1;
  }
}