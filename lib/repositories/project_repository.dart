import '../models/project.dart';
import '../storage/csv_storage.dart';

class ProjectRepository {
  const ProjectRepository({this.storage = const CsvStorage()});

  final CsvStorage storage;

  static const String _fileName = 'projects.csv';

  Future<List<Project>> getAllProjects() async {
    final rows = await storage.readCsv(_fileName);
    return rows.map(Project.fromCsvRow).toList();
  }

  Future<List<Project>> getProjectsByStaffId(int staffId) async {
    final projects = await getAllProjects();
    return projects.where((project) => project.staffId == staffId).toList();
  }

  Future<void> addProject(Project project) async {
    final projectList = await getAllProjects();
    final nextProject = project.projectId > 0
        ? project
        : project.copyWith(
            projectId: _nextId(
              projectList.map((item) => item.projectId).toList(),
            ),
          );
    projectList.add(nextProject);
    await _saveAll(projectList);
  }

  Future<void> updateProject(Project project) async {
    final projectList = await getAllProjects();
    final index = projectList.indexWhere(
      (item) => item.projectId == project.projectId,
    );
    if (index == -1) {
      return;
    }

    projectList[index] = project;
    await _saveAll(projectList);
  }

  Future<void> deleteProject(int id) async {
    final projectList = await getAllProjects();
    projectList.removeWhere((item) => item.projectId == id);
    await _saveAll(projectList);
  }

  Future<void> _saveAll(List<Project> projects) async {
    await storage.writeCsv(
      _fileName,
      projects.map((project) => project.toCsvRow()).toList(),
    );
  }

  int _nextId(List<int> ids) {
    if (ids.isEmpty) {
      return 1;
    }

    return ids.reduce((maxId, id) => id > maxId ? id : maxId) + 1;
  }
}