---
title: "E13: frontmatter without spec_version"
content_type: original
license: CC0 1.0
created_date: "2026-11-23"
---

# E13: frontmatter without spec_version

The frontmatter does not declare spec_version, which §3.1 and §10 require.

---

## The edit made after sealing

The `spec_version` line was deleted from the frontmatter.

---

## Why it is here

This file demonstrates a case in the proposed rulings E13 and E14
(KnobeOne/knobe-protocol#22). The text above was sealed with a body_hash,
so a verifier that finds the body in the right place reports it as
unchanged. The two horizontal rules are part of the sealed body.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6ImF1dGhvciJ9XX0sImJvZHlfaGFzaCI6IjI3MjllMjZlM2Q1YWU0ZDI0NWZjYmU0
ZDk4NGIzYWZjODIyOTE4Yzk2YTE5MmUxY2ZmM2RlNTYxOGI5OWM2NGUiLCJjb250ZW50X3R5cGUi
OiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJpZGVudGl0eV9zdGF0dXMi
OiJkZWNsYXJlZCIsImxpY2Vuc2UiOiJDQzAgMS4wIiwicGF5bG9hZF9oYXNoIjoiMTFkYjJlYTg0
MmQ0NmQzOWYzMTk4MjQ3ZjBiMzZhYzMyOGM3MGZlYjAyODJlNTNhYzczYTQzNzBiNDczZGEyNyIs
InByaXZhY3lfbGV2ZWwiOiJwdWJsaWMiLCJxdWFyYW50aW5lX3N0YXR1cyI6InF1YXJhbnRpbmUi
LCJzcGVjX3ZlcnNpb24iOiIxLjAiLCJzdW1tYXJ5IjoiVGhlIGZyb250bWF0dGVyIGRvZXMgbm90
IGRlY2xhcmUgc3BlY192ZXJzaW9uLCB3aGljaCDCpzMuMSBhbmQgwqcxMCByZXF1aXJlLiBEZW1v
IGZpbGUgZm9yIHRoZSBwcm9wb3NlZCBydWxpbmdzIEUxMyBhbmQgRTE0LiIsInRpdGxlIjoiRTEz
OiBmcm9udG1hdHRlciB3aXRob3V0IHNwZWNfdmVyc2lvbiJ9
-----END KNOBE B64-----
