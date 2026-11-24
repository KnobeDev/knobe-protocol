Forwarded from the course site. Please read before class.
---
title: "E14: a line before the frontmatter"
spec_version: "1.0"
content_type: original
license: CC0 1.0
created_date: "2026-11-23"
---

# E14: a line before the frontmatter

A line of text sits above the opening `---`, so line 1 is not the frontmatter's opening delimiter.

---

## The edit made after sealing

One line of text was added before line 1.

---

## Why it is here

This file demonstrates a case in the proposed rulings E13 and E14
(KnobeOne/knobe-protocol#22). The text above was sealed with a body_hash,
so a verifier that finds the body in the right place reports it as
unchanged. The two horizontal rules are part of the sealed body.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6ImF1dGhvciJ9XX0sImJvZHlfaGFzaCI6IjQ0YzRmMWRmN2Q0MDFhODI2MWVlNGUw
ZmMxZjEyZTk0OWQ2ZThiYjMwOTBkMjJhOWI5YWM3YjM5NzFmOWZjYjMiLCJjb250ZW50X3R5cGUi
OiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJpZGVudGl0eV9zdGF0dXMi
OiJkZWNsYXJlZCIsImxpY2Vuc2UiOiJDQzAgMS4wIiwicGF5bG9hZF9oYXNoIjoiNWE2ZGI3YjBi
ODA3YTQ2MGVjOTQ0NzEzNmNhMTlkODNmMWJjZTA3Yzc0NzkyYzZjNzYwMjc3NDYxYTE5ODEyYyIs
InByaXZhY3lfbGV2ZWwiOiJwdWJsaWMiLCJxdWFyYW50aW5lX3N0YXR1cyI6InF1YXJhbnRpbmUi
LCJzcGVjX3ZlcnNpb24iOiIxLjAiLCJzdW1tYXJ5IjoiQSBsaW5lIG9mIHRleHQgc2l0cyBhYm92
ZSB0aGUgb3BlbmluZyBgLS0tYCwgc28gbGluZSAxIGlzIG5vdCB0aGUgZnJvbnRtYXR0ZXIncyBv
cGVuaW5nIGRlbGltaXRlci4gRGVtbyBmaWxlIGZvciB0aGUgcHJvcG9zZWQgcnVsaW5ncyBFMTMg
YW5kIEUxNC4iLCJ0aXRsZSI6IkUxNDogYSBsaW5lIGJlZm9yZSB0aGUgZnJvbnRtYXR0ZXIifQ==
-----END KNOBE B64-----
