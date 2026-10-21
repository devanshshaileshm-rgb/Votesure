VOTESECURE — NO XAMPP / NO NODE.JS / NO COMPOSER EDITION

This is a simplified native-PHP version of the VoteSecure college project.
It does NOT use Laravel, Composer, Node.js, MySQL, Apache, or XAMPP.
It stores data in a local SQLite database file created automatically in the data folder.
OTP is demo-only and is shown on the verification screen; no SMS account is needed.

REQUIREMENTS
- Windows
- PHP 8+ installed separately, with PDO SQLite enabled
- VS Code is recommended but not required

RUN IT
1. Extract the ZIP.
2. Open the extracted folder in VS Code.
3. Open Terminal > New Terminal.
4. Run: php -m
   Check that both PDO and pdo_sqlite appear in the list.
5. Run: php -S 127.0.0.1:8000
6. Open http://127.0.0.1:8000 in your browser.

If Windows says 'php is not recognized', PHP is not installed or its folder is not in PATH.
You will need to install standalone PHP (not XAMPP) and add its folder to PATH.

DEMO ADMIN
Email: admin@voting.local
Password: Admin@12345

HOW VOTER OTP WORKS
Register -> OTP is generated -> OTP is shown on the verification screen -> enter it -> vote.
For later logins, use email/password and enter the newly generated demo OTP.

IMPORTANT
This is an educational local demo, not a production-grade election platform. Demo OTP is visible in the browser, and the app has not been independently security-audited. Keep the database file if you want to preserve demo data; delete data/votesecure.sqlite to reset the app.
