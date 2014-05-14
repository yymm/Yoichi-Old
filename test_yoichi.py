import os
import yoichi
import tempfile

DATABASE = 'SQLALCHEMY_DATABASE_URI'


class TestYoichi():
    def setup(self):
        self.db_fd, yoichi.app.config[DATABASE] = tempfile.mkdtemp()
        self.app = yoichi.app.test_client()
        yoichi.database.init_db()

    def teardown(self):
        os.close(self.db_fd)
        os.unlink(yoichi.app.config[DATABASE])
