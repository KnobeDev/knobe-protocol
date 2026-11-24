---
title: "E13: empty spec_version"
spec_version: ""
content_type: original
license: CC0 1.0
created_date: "2026-11-23"
---

# E13: empty spec_version

The frontmatter declares spec_version with an empty string.

---

## The edit made after sealing

The frontmatter value was changed to `spec_version: ""`.

---

## Why it is here

This file demonstrates a case in the proposed rulings E13 and E14
(KnobeOne/knobe-protocol#22). The text above was sealed with a body_hash,
so a verifier that finds the body in the right place reports it as
unchanged. The two horizontal rules are part of the sealed body.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6ImF1dGhvciJ9XX0sImJvZHlfaGFzaCI6ImE2MTYxZTA1ODVjNGUxOGI4NTg1NzQz
NWU2ZDZkOGEzYjNmOTk5YzNhNGQ5NjE2ZjE3YjA2YWEzMDRmYzliMDQiLCJjb250ZW50X3R5cGUi
OiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJpZGVudGl0eV9zdGF0dXMi
OiJkZWNsYXJlZCIsImxpY2Vuc2UiOiJDQzAgMS4wIiwicGF5bG9hZF9oYXNoIjoiOGYzZjVhMDU3
N2IwNjcwNDVjMmFlOWM0MzYwODcxNjg5MjRiYWQwZDQ0MjYzYjQwNjEyY2RlNGU4ZWIxYTk0ZCIs
InByaXZhY3lfbGV2ZWwiOiJwdWJsaWMiLCJxdWFyYW50aW5lX3N0YXR1cyI6InF1YXJhbnRpbmUi
LCJzcGVjX3ZlcnNpb24iOiIxLjAiLCJzdW1tYXJ5IjoiVGhlIGZyb250bWF0dGVyIGRlY2xhcmVz
IHNwZWNfdmVyc2lvbiB3aXRoIGFuIGVtcHR5IHN0cmluZy4gRGVtbyBmaWxlIGZvciB0aGUgcHJv
cG9zZWQgcnVsaW5ncyBFMTMgYW5kIEUxNC4iLCJ0aXRsZSI6IkUxMzogZW1wdHkgc3BlY192ZXJz
aW9uIn0=
-----END KNOBE B64-----
