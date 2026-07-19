class Interest {
  const Interest({
    required this.interestId,
    required this.staffId,
    required this.interest,
  });

  final int interestId;
  final int staffId;
  final String interest;

  Interest copyWith({int? interestId, int? staffId, String? interest}) {
    return Interest(
      interestId: interestId ?? this.interestId,
      staffId: staffId ?? this.staffId,
      interest: interest ?? this.interest,
    );
  }

  factory Interest.fromCsvRow(List<String> row) {
    return Interest(
      interestId: _parseInt(_value(row, 0)),
      staffId: _parseInt(_value(row, 1)),
      interest: _value(row, 2),
    );
  }

  List<String> toCsvRow() {
    return <String>[
      interestId.toString(),
      staffId.toString(),
      interest,
    ];
  }

  @override
  String toString() {
    return 'Interest(interestId: $interestId, staffId: $staffId, interest: $interest)';
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