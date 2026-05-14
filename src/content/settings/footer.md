---
settings_kind: footer
editorial_status: approved
content_owner_role: super_admin
index_behavior: exclude
search_note: Footer columns remain compiled from the approved mega-nav graph; institution contact lines are sourced from the contact singleton (REM-CARCH-004).
---

# Footer settings

Editorial shell for footer-level settings. Institution **address / phone / email** lines for the chrome contact block are authored in **`contact.md`** (singleton `contact`); `src/data/footer.ts` compiles column link sets from mega-nav and aggregates `getFooterContactFromSettings()` at build time.
