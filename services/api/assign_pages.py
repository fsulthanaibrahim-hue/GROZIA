from database import SessionLocal
import models
from pages import DEFAULT_PAGES

db = SessionLocal()
for email, pages in DEFAULT_PAGES.items():
    u = db.query(models.User).filter(models.User.email == email).first()
    if not u:
        continue
    for p in pages:
        exists = db.query(models.UserPage).filter_by(user_id=u.id, page=p).first()
        if not exists:
            db.add(models.UserPage(user_id=u.id, page=p))
db.commit()
print("done")
