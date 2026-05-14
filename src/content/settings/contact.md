---
settings_kind: contact
editorial_status: approved
content_owner_role: super_admin
index_behavior: exclude
postal_address_lines:
  - Centre for Plant Medicine Research
  - Full postal address and departmental phone listings will be published once editorial sign-off is complete.
search_note: Optional site-level contact block; exclude from full-text search per 05 §4.1.
---

# Contact settings

Singleton seed for site-level contact framing. Operational phone and email remain omitted until verified per PRD / architecture. **REM-CARCH-004:** the deep footer contact block reads `postal_address_lines`, `primary_phone`, and `primary_email` from this entry at build time (`getFooterContactFromSettings` in `src/data/footer.ts`).
