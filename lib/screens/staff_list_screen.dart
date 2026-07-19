import 'package:flutter/material.dart';

import '../models/staff.dart';
import '../repositories/staff_repository.dart';
import 'staff_detail_screen.dart';

class StaffListScreen extends StatefulWidget {
  const StaffListScreen({super.key});

  @override
  State<StaffListScreen> createState() => _StaffListScreenState();
}

class _StaffListScreenState extends State<StaffListScreen> {
  final StaffRepository _staffRepository = const StaffRepository();
  late Future<List<Staff>> _staffFuture;

  @override
  void initState() {
    super.initState();
    _staffFuture = _staffRepository.getAllStaff();
  }

  void _reloadStaff() {
    setState(() {
      _staffFuture = _staffRepository.getAllStaff();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Staff'),
      ),
      body: FutureBuilder<List<Staff>>(
        future: _staffFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Text('Failed to load staff: ${snapshot.error}'),
            );
          }

          final staffList = snapshot.data ?? const <Staff>[];
          if (staffList.isEmpty) {
            return const Center(
              child: Text('No staff records found.'),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: staffList.length,
            separatorBuilder: (context, index) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final staff = staffList[index];
              return Card(
                child: ListTile(
                  leading: CircleAvatar(
                    child: Text(staff.name.isNotEmpty ? staff.name[0] : '?'),
                  ),
                  title: Text(staff.name),
                  subtitle: Text(staff.email),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () async {
                    await Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => StaffDetailScreen(staff: staff),
                      ),
                    );
                    _reloadStaff();
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}