import os
import tempfile
import yoichi
from yoichi.database import User


class TestYoichi():
    def setup(self):
        self.db_fd, self.temp_path = tempfile.mkstemp()
        yoichi.app.config['SQLALCHEMY_DATABASE_URI'] \
            = 'sqlite:///' + self.temp_path
        self.app = yoichi.app.test_client()
        yoichi.database.init_db()

    def teardown(self):
        os.close(self.db_fd)
        os.unlink(self.temp_path)

    def test_add_user(self):
        user = yoichi.database.add_user('hoge')
        assert user.name == 'hoge'
        db_user = User.query.filter_by(name='hoge').first()
        assert user.name == db_user.name
