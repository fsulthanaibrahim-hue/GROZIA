ALL_PAGES = ["products", "customers", "complaints", "settings"]

# Only used to seed initial assignments. Not a runtime fallback.
DEFAULT_PAGES = {
    "owner@grozia.com": ["products", "customers", "complaints", "settings"],
    "manager@grozia.com": ["products", "customers", "complaints"],
    "accountant@grozia.com": ["customers"],
}
