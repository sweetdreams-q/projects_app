import '../models/staff.dart';
import '../storage/staff_storage.dart';

class StaffRepository {
  const StaffRepository({this.storage = const StaffStorage()});

  final StaffStorage storage;

  Future<List<Staff>> fetchStaff() async {
    final names = await storage.loadStaffNames();
    return names
        .asMap()
        .entries
        .map(
          (entry) => Staff(
            id: entry.key + 1,
            name: entry.value,
            email: '',
          ),
        )
        .toList();
  }
}