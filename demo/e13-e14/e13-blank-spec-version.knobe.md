---
title: "E13: spec_version followed only by spaces"
spec_version:   
content_type: original
license: CC0 1.0
created_date: "2026-11-23"
---

# E13: spec_version followed only by spaces

The frontmatter has a spec_version key with no value, only trailing spaces.

---

## The edit made after sealing

The frontmatter line was changed to `spec_version:` followed by three spaces.

---

## Why it is here

This file demonstrates a case in the proposed rulings E13 and E14
(KnobeOne/knobe-protocol#22). The text above was sealed with a body_hash,
so a verifier that finds the body in the right place reports it as
unchanged. The two horizontal rules are part of the sealed body.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6ImF1dGhvciJ9XX0sImJvZHlfaGFzaCI6Ijk3ZTFkMGZmZDJmNDU2YWJkZTkwNjUz
ZTA3ZjYzN2U1YmQ1ODAyYzk5MjljNjIzYzNiZDQ3NTk4NTJiNjU2MWUiLCJjb250ZW50X3R5cGUi
OiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJpZGVudGl0eV9zdGF0dXMi
OiJkZWNsYXJlZCIsImxpY2Vuc2UiOiJDQzAgMS4wIiwicGF5bG9hZF9oYXNoIjoiZjc5MDM3NGFh
YmYwOGZlZWVkM2I3NzY5ZGQzMDVlOWQ4ODE3NDY0MThkN2MwNmM5Njg2OGM2ZGIzNGFhMTliMSIs
InByaXZhY3lfbGV2ZWwiOiJwdWJsaWMiLCJxdWFyYW50aW5lX3N0YXR1cyI6InF1YXJhbnRpbmUi
LCJzcGVjX3ZlcnNpb24iOiIxLjAiLCJzdW1tYXJ5IjoiVGhlIGZyb250bWF0dGVyIGhhcyBhIHNw
ZWNfdmVyc2lvbiBrZXkgd2l0aCBubyB2YWx1ZSwgb25seSB0cmFpbGluZyBzcGFjZXMuIERlbW8g
ZmlsZSBmb3IgdGhlIHByb3Bvc2VkIHJ1bGluZ3MgRTEzIGFuZCBFMTQuIiwidGl0bGUiOiJFMTM6
IHNwZWNfdmVyc2lvbiBmb2xsb3dlZCBvbmx5IGJ5IHNwYWNlcyJ9
-----END KNOBE B64-----
