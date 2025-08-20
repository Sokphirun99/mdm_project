import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AppDetailsPage extends ConsumerWidget {
  final String appId;

  const AppDetailsPage({
    super.key,
    required this.appId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Center(
        child: Text('App Details Page - App ID: $appId'),
      ),
    );
  }
}
