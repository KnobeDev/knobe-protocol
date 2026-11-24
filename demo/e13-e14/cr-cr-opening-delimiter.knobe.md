---
title: "Trailing CRs on the opening delimiter"
spec_version: "1.0"
content_type: original
license: CC0 1.0
created_date: "2026-11-23"
---

# Trailing CRs on the opening delimiter

The opening delimiter line ends in two carriage returns before its line feed.

---

## The edit made after sealing

Line 1 was changed from `---` to `---` followed by CR CR.

---

## Why it is here

This file demonstrates a case in the proposed rulings E13 and E14
(KnobeOne/knobe-protocol#22). The text above was sealed with a body_hash,
so a verifier that finds the body in the right place reports it as
unchanged. The two horizontal rules are part of the sealed body.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6ImF1dGhvciJ9XX0sImJvZHlfaGFzaCI6IjRkODI1NmRiYjE3MTIzM2Q3ZDljY2Vi
YjY3MTVhYzc5Nzc1NDY1NDcxMjgwZjQ5ZTY2ODdlZDA2ODQxZDEzNmMiLCJjb250ZW50X3R5cGUi
OiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJpZGVudGl0eV9zdGF0dXMi
OiJkZWNsYXJlZCIsImxpY2Vuc2UiOiJDQzAgMS4wIiwicGF5bG9hZF9oYXNoIjoiY2Y3NjRhMzIx
M2U1NGUxMjQ2N2UxMDRiOTY2ZWQ3YzYxOTBlNWVjZjVhYTkyMGE4ZjRlMDU0Y2E3ZDdlNzAyYiIs
InByaXZhY3lfbGV2ZWwiOiJwdWJsaWMiLCJxdWFyYW50aW5lX3N0YXR1cyI6InF1YXJhbnRpbmUi
LCJzcGVjX3ZlcnNpb24iOiIxLjAiLCJzdW1tYXJ5IjoiVGhlIG9wZW5pbmcgZGVsaW1pdGVyIGxp
bmUgZW5kcyBpbiB0d28gY2FycmlhZ2UgcmV0dXJucyBiZWZvcmUgaXRzIGxpbmUgZmVlZC4gRGVt
byBmaWxlIGZvciB0aGUgcHJvcG9zZWQgcnVsaW5ncyBFMTMgYW5kIEUxNC4iLCJ0aXRsZSI6IlRy
YWlsaW5nIENScyBvbiB0aGUgb3BlbmluZyBkZWxpbWl0ZXIifQ==
-----END KNOBE B64-----
