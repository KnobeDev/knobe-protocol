---
title: "Frontmatter Without Spec Version"
---

# Frontmatter Without Spec Version

The YAML frontmatter above declares a title but no spec_version, which spec §3.1 and §10 require. The sealed payload declares 1.0 and stays authoritative for verification. Integrity is unaffected; only conformance changes. Expected status: verified, body_verified: omitted, conformance: invalid, with one issue saying the frontmatter does not declare spec_version.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6IlRlc3QgdmVjdG9yIGF1dGhvciJ9XX0sImNvbnRlbnRfdHlwZSI6Im9yaWdpbmFs
IiwiY3JlYXRlZF9kYXRlIjoiMjAyNi0xMS0yMyIsImxpY2Vuc2UiOiJDQzAgMS4wIiwicGF5bG9h
ZF9oYXNoIjoiN2JjODdhZmY0MGVjMzliZWI5NDFmNmIwM2IyMmUyOGU3MzlmNjlmZTdmZWZjZGQ3
ZmZkNTA2ZTYwOTEzYjA0MSIsInByaXZhY3lfbGV2ZWwiOiJwdWJsaWMiLCJxdWFyYW50aW5lX3N0
YXR1cyI6InF1YXJhbnRpbmUiLCJzcGVjX3ZlcnNpb24iOiIxLjAiLCJzdW1tYXJ5IjoiUGlucyB0
aGF0IGEgZnJvbnRtYXR0ZXIgYmxvY2sgd2hpY2ggZG9lcyBub3QgZGVjbGFyZSBzcGVjX3ZlcnNp
b24gbWFrZXMgdGhlIGZpbGUgbm9uY29uZm9ybWluZyB3aXRob3V0IGFmZmVjdGluZyBpbnRlZ3Jp
dHkgKHByb3Bvc2VkIEUxMykuIiwidGl0bGUiOiJGcm9udG1hdHRlciBXaXRob3V0IFNwZWMgVmVy
c2lvbiJ9
-----END KNOBE B64-----
