import 'package:flutter/material.dart';

import '../models/interest.dart';
import '../models/project.dart';
import '../models/staff.dart';
import '../repositories/interest_repository.dart';
import '../repositories/project_repository.dart';
import '../repositories/staff_repository.dart';
import 'staff_detail_screen.dart';

class StaffListScreen extends StatefulWidget {
  const StaffListScreen({super.key});

  @override
  State<StaffListScreen> createState() => _StaffListScreenState();
}

class _StaffListScreenState extends State<StaffListScreen> {
  final StaffRepository _staffRepository = const StaffRepository();
  final InterestRepository _interestRepository = const InterestRepository();
  final ProjectRepository _projectRepository = const ProjectRepository();
  late Future<_StaffSearchData> _dataFuture;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _dataFuture = _loadData();
  }

  Future<_StaffSearchData> _loadData() async {
    final staff = await _staffRepository.getAllStaff();
    final interests = await _interestRepository.getAllInterests();
    final projects = await _projectRepository.getAllProjects();
    return _StaffSearchData(
      staff: staff,
      interests: interests,
      projects: projects,
    );
  }

  void _reloadStaff() {
    setState(() {
      _dataFuture = _loadData();
    });
  }

  void _updateQuery(String value) {
    setState(() {
      _query = value;
    });
  }

  List<Staff> _filterStaff(_StaffSearchData data) {
    final query = _query.trim().toLowerCase();
    if (query.isEmpty) {
      return data.staff;
    }

    final interestMatches = <int>{
      for (final interest in data.interests)
        if (interest.interest.toLowerCase().contains(query)) interest.staffId,
    };

    final projectMatches = <int>{
      for (final project in data.projects)
        if (project.title.toLowerCase().contains(query)) project.staffId,
    };

    return data.staff.where((staff) {
      final nameMatches = staff.name.toLowerCase().contains(query);
      return nameMatches || interestMatches.contains(staff.id) || projectMatches.contains(staff.id);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Staff'),
      ),
      body: FutureBuilder<_StaffSearchData>(
        future: _dataFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Text('Failed to load staff: ${snapshot.error}'),
            );
          }

          final staffList = _filterStaff(snapshot.data ?? _StaffSearchData.empty());

          return RefreshIndicator(
            onRefresh: () async {
              _reloadStaff();
              await _dataFuture;
            },
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                TextField(
                  onChanged: _updateQuery,
                  decoration: InputDecoration(
                    labelText: 'Search staff, interests, or projects',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                if (staffList.isEmpty)
                  const Padding(
                    padding: EdgeInsets.only(top: 24),
                    child: Center(
                      child: Text('No matching staff found.'),
                    ),
                  )
                else
                  ...staffList.expand(
                    (staff) => [
                      Card(
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
                      ),
                      const SizedBox(height: 12),
                    ],
                  ).toList()
              ],
            ),
          );
        },
      ),
    );
  }
}

class _StaffSearchData {
  const _StaffSearchData({
    required this.staff,
    required this.interests,
    required this.projects,
  });

  const _StaffSearchData.empty()
      : staff = const <Staff>[],
        interests = const <Interest>[],
        projects = const <Project>[];

  final List<Staff> staff;
  final List<Interest> interests;
  final List<Project> projects;
}