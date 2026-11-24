---
title: "BOM: byte-order mark, body_hash sealed"
spec_version: "1.0"
content_type: original
license: CC0 1.0
created_date: "2026-11-23"
---

# BOM: byte-order mark, body_hash sealed

A UTF-8 byte-order mark precedes the opening `---`, as some Windows editors save files.

---

## The edit made after sealing

A UTF-8 byte-order mark (EF BB BF) was added before line 1.

---

## Why it is here

This file demonstrates a case in the proposed rulings E13 and E14
(KnobeOne/knobe-protocol#22). The text above was sealed with a body_hash,
so a verifier that finds the body in the right place reports it as
unchanged. The two horizontal rules are part of the sealed body.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6ImF1dGhvciJ9XX0sImJvZHlfaGFzaCI6ImM2ZDNlN2I4ZGQ5YjRkNzU0OGY3ODY0
NDUxMDkxZGE5YjIyNzVjYjJiMmI2ZTQ2MTk2MzEzMmFiMzZhYTEwOGEiLCJjb250ZW50X3R5cGUi
OiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJpZGVudGl0eV9zdGF0dXMi
OiJkZWNsYXJlZCIsImxpY2Vuc2UiOiJDQzAgMS4wIiwicGF5bG9hZF9oYXNoIjoiNTU2ZGM1NGY2
Njc4ZDk1YTU0ZmMyZTY5MTI3MWQ3YTRmOGRmY2Q4ZjU3OTRlNGY5NTNlZWMwMDRkYzQxZmFmZSIs
InByaXZhY3lfbGV2ZWwiOiJwdWJsaWMiLCJxdWFyYW50aW5lX3N0YXR1cyI6InF1YXJhbnRpbmUi
LCJzcGVjX3ZlcnNpb24iOiIxLjAiLCJzdW1tYXJ5IjoiQSBVVEYtOCBieXRlLW9yZGVyIG1hcmsg
cHJlY2VkZXMgdGhlIG9wZW5pbmcgYC0tLWAsIGFzIHNvbWUgV2luZG93cyBlZGl0b3JzIHNhdmUg
ZmlsZXMuIERlbW8gZmlsZSBmb3IgdGhlIHByb3Bvc2VkIHJ1bGluZ3MgRTEzIGFuZCBFMTQuIiwi
dGl0bGUiOiJCT006IGJ5dGUtb3JkZXIgbWFyaywgYm9keV9oYXNoIHNlYWxlZCJ9
-----END KNOBE B64-----
