import 'dart:io';

import 'package:path_provider/path_provider.dart';

class CsvStorage {
  const CsvStorage({this.directoryProvider});

  final Future<Directory> Function()? directoryProvider;

  Future<List<List<String>>> readCsv(String fileName) async {
    final file = await _fileFor(fileName);
    if (!await file.exists()) {
      return const <List<String>>[];
    }

    final content = await file.readAsString();
    if (content.trim().isEmpty) {
      return const <List<String>>[];
    }

    return content
        .split(RegExp(r'\r?\n'))
        .where((row) => row.trim().isNotEmpty)
        .map((row) => row.split(','))
        .toList();
  }

  Future<void> writeCsv(String fileName, List<List<String>> rows) async {
    final file = await _fileFor(fileName);
    final content = rows.map((row) => row.join(',')).join('\n');
    await file.writeAsString(content);
  }

  Future<File> _fileFor(String fileName) async {
    final directory = directoryProvider != null
        ? await directoryProvider!()
        : await getApplicationDocumentsDirectory();
    return File('${directory.path}${Platform.pathSeparator}$fileName');
  }
}