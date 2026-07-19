import 'package:flutter/material.dart';

import '../models/interest.dart';
import '../models/project.dart';
import '../models/staff.dart';
import '../repositories/interest_repository.dart';
import '../repositories/project_repository.dart';
import 'edit_interest_screen.dart';
import 'edit_project_screen.dart';

class StaffDetailScreen extends StatefulWidget {
  const StaffDetailScreen({super.key, required this.staff});

  final Staff staff;

  @override
  State<StaffDetailScreen> createState() => _StaffDetailScreenState();
}

class _StaffDetailScreenState extends State<StaffDetailScreen> {
  final InterestRepository _interestRepository = const InterestRepository();
  final ProjectRepository _projectRepository = const ProjectRepository();

  late Future<List<Interest>> _interestsFuture;
  late Future<List<Project>> _projectsFuture;

  @override
  void initState() {
    super.initState();
    _reloadData();
  }

  void _reloadData() {
    _interestsFuture = _interestRepository.getInterestsByStaffId(widget.staff.id);
    _projectsFuture = _projectRepository.getProjectsByStaffId(widget.staff.id);
  }

  void _refresh() {
    setState(() {
      _reloadData();
    });
  }

  Future<void> _openInterestEditor({Interest? interest}) async {
    final changed = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => EditInterestScreen(
          staffId: widget.staff.id,
          interest: interest,
        ),
      ),
    );

    if (changed == true) {
      _refresh();
    }
  }

  Future<void> _openProjectEditor({Project? project}) async {
    final changed = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => EditProjectScreen(
          staffId: widget.staff.id,
          project: project,
        ),
      ),
    );

    if (changed == true) {
      _refresh();
    }
  }

  Future<void> _deleteInterest(Interest interest) async {
    await _interestRepository.deleteInterest(interest.interestId);
    _refresh();
  }

  Future<void> _deleteProject(Project project) async {
    await _projectRepository.deleteProject(project.projectId);
    _refresh();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.staff.name),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openInterestEditor(),
        icon: const Icon(Icons.add),
        label: const Text('Add Interest'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.staff.name,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 8),
                  Text('ID: ${widget.staff.id}'),
                  const SizedBox(height: 4),
                  Text('Email: ${widget.staff.email.isEmpty ? 'Not set' : widget.staff.email}'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          _buildSectionHeader(
            title: 'Interests',
            onAdd: () => _openInterestEditor(),
          ),
          const SizedBox(height: 8),
          FutureBuilder<List<Interest>>(
            future: _interestsFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: Padding(
                  padding: EdgeInsets.all(24),
                  child: CircularProgressIndicator(),
                ));
              }

              if (snapshot.hasError) {
                return Text('Failed to load interests: ${snapshot.error}');
              }

              final interests = snapshot.data ?? const <Interest>[];
              if (interests.isEmpty) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Text('No interests yet.'),
                );
              }

              return Column(
                children: interests.map((interest) {
                  return Card(
                    child: ListTile(
                      title: Text(interest.interest),
                      subtitle: Text('Interest ID: ${interest.interestId}'),
                      trailing: Wrap(
                        spacing: 8,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit),
                            onPressed: () => _openInterestEditor(interest: interest),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete),
                            onPressed: () => _deleteInterest(interest),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              );
            },
          ),
          const SizedBox(height: 16),
          _buildSectionHeader(
            title: 'Projects',
            onAdd: () => _openProjectEditor(),
          ),
          const SizedBox(height: 8),
          FutureBuilder<List<Project>>(
            future: _projectsFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(24),
                    child: CircularProgressIndicator(),
                  ),
                );
              }

              if (snapshot.hasError) {
                return Text('Failed to load projects: ${snapshot.error}');
              }

              final projects = snapshot.data ?? const <Project>[];
              if (projects.isEmpty) {
                return const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Text('No projects yet.'),
                );
              }

              return Column(
                children: projects.map((project) {
                  return Card(
                    child: ListTile(
                      title: Text(project.title),
                      subtitle: Text(project.description),
                      isThreeLine: project.description.isNotEmpty,
                      trailing: Wrap(
                        spacing: 8,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit),
                            onPressed: () => _openProjectEditor(project: project),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete),
                            onPressed: () => _deleteProject(project),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader({required String title, required VoidCallback onAdd}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: Theme.of(context).textTheme.titleMedium),
        TextButton.icon(
          onPressed: onAdd,
          icon: const Icon(Icons.add),
          label: const Text('Add'),
        ),
      ],
    );
  }
}