class Staff {
  const Staff({required this.id, required this.name, required this.email});

  final int id;
  final String name;
  final String email;

  Staff copyWith({int? id, String? name, String? email}) {
    return Staff(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
    );
  }

  factory Staff.fromCsvRow(List<String> row) {
    return Staff(
      id: _parseInt(_value(row, 0)),
      name: _value(row, 1),
      email: _value(row, 2),
    );
  }

  List<String> toCsvRow() {
    return <String>[
      id.toString(),
      name,
      email,
    ];
  }

  @override
  String toString() {
    return 'Staff(id: $id, name: $name, email: $email)';
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