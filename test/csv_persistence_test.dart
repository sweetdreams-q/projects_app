import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

import 'package:projects_app/models/interest.dart';
import 'package:projects_app/models/project.dart';
import 'package:projects_app/models/staff.dart';
import 'package:projects_app/repositories/interest_repository.dart';
import 'package:projects_app/repositories/project_repository.dart';
import 'package:projects_app/repositories/staff_repository.dart';
import 'package:projects_app/storage/csv_storage.dart';

void main() {
  late Directory tempDir;

  setUp(() async {
    tempDir = await Directory.systemTemp.createTemp('projects_app_csv_test_');
  });

  tearDown(() async {
    if (await tempDir.exists()) {
      await tempDir.delete(recursive: true);
    }
  });

  test('csv storage persists rows across fresh instances', () async {
    final storage = CsvStorage(directoryProvider: () async => tempDir);
    await storage.writeCsv('staff.csv', [
      ['1', 'Ada Lovelace', 'ada@example.com'],
    ]);

    final reloadedStorage = CsvStorage(directoryProvider: () async => tempDir);
    final rows = await reloadedStorage.readCsv('staff.csv');

    expect(rows, hasLength(1));
    expect(rows.first, ['1', 'Ada Lovelace', 'ada@example.com']);
  });

  test('repositories read back saved csv data after recreation', () async {
    final storage = CsvStorage(directoryProvider: () async => tempDir);
    final staffRepository = StaffRepository(storage: storage);
    final interestRepository = InterestRepository(storage: storage);
    final projectRepository = ProjectRepository(storage: storage);

    await staffRepository.addStaff(
      const Staff(id: 1, name: 'Grace Hopper', email: 'grace@example.com'),
    );
    await interestRepository.addInterest(
      const Interest(interestId: 1, staffId: 1, interest: 'Systems'),
    );
    await projectRepository.addProject(
      const Project(
        projectId: 1,
        staffId: 1,
        title: 'Compiler',
        description: 'Build a compiler prototype',
      ),
    );

    final reloadedStorage = CsvStorage(directoryProvider: () async => tempDir);
    final reloadedStaff = StaffRepository(storage: reloadedStorage);
    final reloadedInterests = InterestRepository(storage: reloadedStorage);
    final reloadedProjects = ProjectRepository(storage: reloadedStorage);

    expect(await reloadedStaff.getAllStaff(), hasLength(1));
    expect(await reloadedInterests.getInterestsByStaffId(1), hasLength(1));
    expect(await reloadedProjects.getProjectsByStaffId(1), hasLength(1));
  });
}
