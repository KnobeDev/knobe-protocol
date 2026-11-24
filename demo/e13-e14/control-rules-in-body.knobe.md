---
title: "Control: horizontal rules in the body"
spec_version: "1.0"
content_type: original
license: CC0 1.0
created_date: "2026-11-23"
---

# Control: horizontal rules in the body

A clean sealed file whose body holds `---` horizontal rules. Every engine should verify it.

---

## The edit made after sealing

None. This is the positive control the steward asked for in #22.

---

## Why it is here

This file demonstrates a case in the proposed rulings E13 and E14
(KnobeOne/knobe-protocol#22). The text above was sealed with a body_hash,
so a verifier that finds the body in the right place reports it as
unchanged. The two horizontal rules are part of the sealed body.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6ImF1dGhvciJ9XX0sImJvZHlfaGFzaCI6IjE0MmEzYmI3YzdmNTRkMjgyYTY5NWU0
ZTZmYTUxMzM3MTBjZTQ1YTZlNzRmODdmZjJlYWQ1M2VjYzUwOTRmYTEiLCJjb250ZW50X3R5cGUi
OiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJpZGVudGl0eV9zdGF0dXMi
OiJkZWNsYXJlZCIsImxpY2Vuc2UiOiJDQzAgMS4wIiwicGF5bG9hZF9oYXNoIjoiZWY1YjY5Y2Q2
OGNiOTlmZjQ4OTg0MDM3YTQxYzY0OTA1OWY0ZDg2OGQ0ZjYxODI5OTRkNDFlNDRmZjllMDk2ZCIs
InByaXZhY3lfbGV2ZWwiOiJwdWJsaWMiLCJxdWFyYW50aW5lX3N0YXR1cyI6InF1YXJhbnRpbmUi
LCJzcGVjX3ZlcnNpb24iOiIxLjAiLCJzdW1tYXJ5IjoiQSBjbGVhbiBzZWFsZWQgZmlsZSB3aG9z
ZSBib2R5IGhvbGRzIGAtLS1gIGhvcml6b250YWwgcnVsZXMuIEV2ZXJ5IGVuZ2luZSBzaG91bGQg
dmVyaWZ5IGl0LiBEZW1vIGZpbGUgZm9yIHRoZSBwcm9wb3NlZCBydWxpbmdzIEUxMyBhbmQgRTE0
LiIsInRpdGxlIjoiQ29udHJvbDogaG9yaXpvbnRhbCBydWxlcyBpbiB0aGUgYm9keSJ9
-----END KNOBE B64-----
