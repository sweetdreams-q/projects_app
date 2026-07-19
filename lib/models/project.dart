class Project {
  const Project({
    required this.projectId,
    required this.staffId,
    required this.title,
    required this.description,
  });

  final int projectId;
  final int staffId;
  final String title;
  final String description;

  Project copyWith({
    int? projectId,
    int? staffId,
    String? title,
    String? description,
  }) {
    return Project(
      projectId: projectId ?? this.projectId,
      staffId: staffId ?? this.staffId,
      title: title ?? this.title,
      description: description ?? this.description,
    );
  }

  factory Project.fromCsvRow(List<String> row) {
    return Project(
      projectId: _parseInt(_value(row, 0)),
      staffId: _parseInt(_value(row, 1)),
      title: _value(row, 2),
      description: _value(row, 3),
    );
  }

  List<String> toCsvRow() {
    return <String>[
      projectId.toString(),
      staffId.toString(),
      title,
      description,
    ];
  }

  @override
  String toString() {
    return 'Project(projectId: $projectId, staffId: $staffId, title: $title, description: $description)';
  }
}

String _value(List<String> row, int index) {
  if (index >= row.length) {
    return '';
  }

  return row[index];
}

int _parseInt(String value) {
  return int.tryParse(value.trim()) ?? 0;
}