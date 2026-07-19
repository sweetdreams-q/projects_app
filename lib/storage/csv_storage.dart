import 'dart:io';

import 'package:flutter/services.dart';
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
    final directory = await _resolveDirectory();
    return File('${directory.path}${Platform.pathSeparator}$fileName');
  }

  Future<Directory> _resolveDirectory() async {
    if (directoryProvider != null) {
      return directoryProvider!();
    }

    try {
      return await getApplicationDocumentsDirectory();
    } on MissingPluginException {
      final fallbackDirectory = Directory('${Directory.current.path}${Platform.pathSeparator}data');
      if (!await fallbackDirectory.exists()) {
        await fallbackDirectory.create(recursive: true);
      }
      return fallbackDirectory;
    }
  }
}