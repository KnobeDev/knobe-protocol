---
title: "E13 control: single-quoted spec_version"
spec_version: '1.0'
content_type: original
license: CC0 1.0
created_date: "2026-11-23"
---

# E13 control: single-quoted spec_version

The frontmatter value uses single quotes. Quotes around the value are stripped, so this declares 1.0.

---

## The edit made after sealing

The frontmatter line was changed to `spec_version: '1.0'`.

---

## Why it is here

This file demonstrates a case in the proposed rulings E13 and E14
(KnobeOne/knobe-protocol#22). The text above was sealed with a body_hash,
so a verifier that finds the body in the right place reports it as
unchanged. The two horizontal rules are part of the sealed body.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6ImF1dGhvciJ9XX0sImJvZHlfaGFzaCI6ImRkZDUyNWJkOGU5OTNiZjI3OGFkMDkx
YjZjN2E4Yzc1OTA3NGI5MDY4M2ZlMDU3NzliNGZlZmRhOGMzM2YyNzEiLCJjb250ZW50X3R5cGUi
OiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJpZGVudGl0eV9zdGF0dXMi
OiJkZWNsYXJlZCIsImxpY2Vuc2UiOiJDQzAgMS4wIiwicGF5bG9hZF9oYXNoIjoiNWMyODI3Yzk2
NGQ1ZjhhNmJjYzk0MjVhODUzOGU1MDdkN2E5OTU1NTI1MDU1M2E5M2Q5NmUwZDU1NDhiNDRkMCIs
InByaXZhY3lfbGV2ZWwiOiJwdWJsaWMiLCJxdWFyYW50aW5lX3N0YXR1cyI6InF1YXJhbnRpbmUi
LCJzcGVjX3ZlcnNpb24iOiIxLjAiLCJzdW1tYXJ5IjoiVGhlIGZyb250bWF0dGVyIHZhbHVlIHVz
ZXMgc2luZ2xlIHF1b3Rlcy4gUXVvdGVzIGFyb3VuZCB0aGUgdmFsdWUgYXJlIHN0cmlwcGVkLCBz
byB0aGlzIGRlY2xhcmVzIDEuMC4gRGVtbyBmaWxlIGZvciB0aGUgcHJvcG9zZWQgcnVsaW5ncyBF
MTMgYW5kIEUxNC4iLCJ0aXRsZSI6IkUxMyBjb250cm9sOiBzaW5nbGUtcXVvdGVkIHNwZWNfdmVy
c2lvbiJ9
-----END KNOBE B64-----
