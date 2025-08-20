import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class DeviceDetailsPage extends ConsumerWidget {
  final String deviceId;

  const DeviceDetailsPage({
    super.key,
    required this.deviceId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Center(
        child: Text('Device Details Page - Device ID: $deviceId'),
      ),
    );
  }
}
