---
title: "E13: quoted spec_version key"
"spec_version": "1.0"
content_type: original
license: CC0 1.0
created_date: "2026-11-23"
---

# E13: quoted spec_version key

The frontmatter writes the key in quotes. That is valid YAML, but the proposed ruling says the key must be written bare.

---

## The edit made after sealing

The frontmatter line was changed to `"spec_version": "1.0"`.

---

## Why it is here

This file demonstrates a case in the proposed rulings E13 and E14
(KnobeOne/knobe-protocol#22). The text above was sealed with a body_hash,
so a verifier that finds the body in the right place reports it as
unchanged. The two horizontal rules are part of the sealed body.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6ImF1dGhvciJ9XX0sImJvZHlfaGFzaCI6IjY2ZWEwZTY0NWE5MWI2ZTFjMDI4OWUz
NmQyMzg1ZWFmYmMyZTZlZDA2YmE0Nzg3ZDllY2YxOWQ4MGRkMDk0YzUiLCJjb250ZW50X3R5cGUi
OiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJpZGVudGl0eV9zdGF0dXMi
OiJkZWNsYXJlZCIsImxpY2Vuc2UiOiJDQzAgMS4wIiwicGF5bG9hZF9oYXNoIjoiYmIzN2Y2NTc2
MGEzOWIyNGY5NGM2ZDcwYTY0ZWUxMzQ4ZDhhM2M0MzQ1OGMwZjY3MTUyNzA5OTY4ODI1NzY0YiIs
InByaXZhY3lfbGV2ZWwiOiJwdWJsaWMiLCJxdWFyYW50aW5lX3N0YXR1cyI6InF1YXJhbnRpbmUi
LCJzcGVjX3ZlcnNpb24iOiIxLjAiLCJzdW1tYXJ5IjoiVGhlIGZyb250bWF0dGVyIHdyaXRlcyB0
aGUga2V5IGluIHF1b3Rlcy4gVGhhdCBpcyB2YWxpZCBZQU1MLCBidXQgdGhlIHByb3Bvc2VkIHJ1
bGluZyBzYXlzIHRoZSBrZXkgbXVzdCBiZSB3cml0dGVuIGJhcmUuIERlbW8gZmlsZSBmb3IgdGhl
IHByb3Bvc2VkIHJ1bGluZ3MgRTEzIGFuZCBFMTQuIiwidGl0bGUiOiJFMTM6IHF1b3RlZCBzcGVj
X3ZlcnNpb24ga2V5In0=
-----END KNOBE B64-----
