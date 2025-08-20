import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class PolicyDetailsPage extends ConsumerWidget {
  final String policyId;

  const PolicyDetailsPage({
    super.key,
    required this.policyId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Center(
        child: Text('Policy Details Page - Policy ID: $policyId'),
      ),
    );
  }
}
