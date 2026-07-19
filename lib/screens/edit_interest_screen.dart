import 'package:flutter/material.dart';

import '../models/interest.dart';
import '../repositories/interest_repository.dart';

class EditInterestScreen extends StatefulWidget {
  const EditInterestScreen({super.key, required this.staffId, this.interest});

  final int staffId;
  final Interest? interest;

  @override
  State<EditInterestScreen> createState() => _EditInterestScreenState();
}

class _EditInterestScreenState extends State<EditInterestScreen> {
  final _formKey = GlobalKey<FormState>();
  final InterestRepository _interestRepository = const InterestRepository();
  late final TextEditingController _interestController;

  @override
  void initState() {
    super.initState();
    _interestController = TextEditingController(text: widget.interest?.interest ?? '');
  }

  @override
  void dispose() {
    _interestController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final currentInterest = widget.interest;
    final interest = Interest(
      interestId: currentInterest?.interestId ?? 0,
      staffId: widget.staffId,
      interest: _interestController.text.trim(),
    );

    if (currentInterest == null) {
      await _interestRepository.addInterest(interest);
    } else {
      await _interestRepository.updateInterest(interest);
    }

    if (mounted) {
      Navigator.of(context).pop(true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.interest != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Interest' : 'Add Interest'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _interestController,
                decoration: const InputDecoration(labelText: 'Interest'),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter an interest';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _save,
                  child: Text(isEditing ? 'Update' : 'Save'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}