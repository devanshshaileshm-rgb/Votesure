# Online Voting System with OTP

College project using Laravel + MySQL + Twilio OTP + REST API.

## Included
- Voter registration and login
- bcrypt password hashing
- OTP verification (Twilio or demo mode)
- Elections and candidates
- One-vote-per-user per election (database unique constraint)
- Live result dashboard (polling REST endpoint)
- Admin console
- Audit logging
- JSON REST endpoints

## Requirements
- PHP 8.2+
- Composer
- MySQL 8+
- XAMPP/WAMP optional (Apache is not required when using `php artisan serve`)

## Setup in VS Code
1. Install PHP, Composer and MySQL.
2. Open this folder in VS Code.
3. Copy `.env.example` to `.env`.
4. Create a MySQL database named `voting_system`.
5. In the VS Code terminal run:
   ```bash
   composer install
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve
   ```
6. Open `http://127.0.0.1:8000`.

## Demo accounts
Admin:
- Email: `admin@voting.local`
- Password: `Admin@12345`

Voter:
- Email: `voter@voting.local`
- Password: `Voter@12345`

With `DEMO_OTP=true`, the generated OTP is shown on the verification screen so the project can be demonstrated without a Twilio account.

## Real Twilio OTP
Set these values in `.env`:
```env
TWILIO_SID=your_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
DEMO_OTP=false
```
The application sends OTP through Twilio's Messages REST endpoint using PHP cURL.

Use a real phone number in international format, for example `+919876543210`.

## REST API
- `GET /api/elections`
- `GET /api/elections/{id}/candidates`
- `GET /api/elections/{id}/results`
- `POST /api/elections/{id}/vote` (authenticated)

## Notes for demonstration
The seeded election is active for 7 days from the time of seeding. You can log in as the demo voter, enter the demo OTP, cast a vote, then open the live results page.
