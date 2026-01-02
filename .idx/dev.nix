{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20# Example: Ensure Node.js is available
    # Add any other packages your project needs, e.g., pkgs.python3, pkgs.git
  ];

  # Sets environment variables in the workspace
  env = {
    # --- Backend Environment Variables ---
    # MongoDB (If still needed; remove if fully migrated to Firestore)
    MONGODB_URL = "mongodb+srv://proofflow-ai:Proofflow%2383Jn%219Q@proofflow-ai.blwtnp1.mongodb.net/proofflow-ai?retryWrites=true&w=majority&appName=proofflow-ai";

    # GitHub OAuth Credentials
    GITHUB_CLIENT_ID = "Ov23lizhaiqiNKI0QHah";
    GITHUB_CLIENT_SECRET = "93e98c523ba2b0d02e9e288b7d813a768e429c0b";

    # Firebase Admin SDK Service Account Credentials (for backend Firestore access)
    FIREBASE_TYPE = "service_account";
    FIREBASE_PROJECT_ID = "proofflow-ai";
    FIREBASE_PRIVATE_KEY_ID = "aa5812490159248bae6ff9271c69671d9e1bc04f";
    # IMPORTANT: Newlines in private key are escaped for Nix.
    FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDbR5vbzB0yqJnu\\n7q1c6Qjuujl3Qbb7WDp9uxkb1pHEMAOd4FHzpmYPv3DY2qbh6XmGpvI57TGq92iH\\nWbxiQ3pA9VzxsBfFx11BEXNPuFTeGTELWfsikbV01lwxCpNlsmHpQcTKLZJ7OBjm\\n/64f+2Q3EIVGqzASG/Qb7WXoBac8usKERuoZef7aJjuoI8GmpZ2anlOdLTN+h9qF\\ngv2Iprisqe1K+WZDbk1lVfGmPX7YMvYaBlREiAZf/N+d2V1P65K2kVHc+IPBN0Nz\\nxcBQKIDSA6L0ijpPquzKrERGLbIfHEMjDIxTHK6f4OTAP4jecWEt72DAAMAzk3Kp\\n5ddUylPTAgMBAAECggEAB3HR789pOlwRBdSinCHpRLmb09muTbA8JCKjApfxUPjU\\nVprUDXKbynMUcLhTrB3SG2k1lhPgeM53hQjd5XQnBWePJUF2PSe8mcXu5Uj70KKI\\nULtYVF8gCvxwGtYiFPTOcC3kcXzEmVxZNBaAIePWDiyIadLMCgFa80vHBu6SM/SP\\nIt/nYaOQE4eAhMwna7p7nebjTgHZ3wy0BKDQmjFRKd6mzqJ5n7L04+RGUFZhCOIO\\nm+Key9cMtOqJLlRAfiqgkZZV7LyTNsSfXlNWXd0HnISXqqAtityhG4BmDBSnnqv3\\neyg8tJGsYYmLyY6lUKlCvikYCenMX/75dvxbqdt/8QKBgQD60obXFJEeoMFmYJhE\\nGuW/MnCO3c5/TFeTqVYkYy4LR7/MlsEkzGWgmfcaITGH4rEJyysj/hpVaK6cYuPg\\naPvFdMjv19yFzpQNYZ0T8RHy7Hrct7GV8z3xmGsNVAxmuVTib5WPScw4ctuzyMxu\\n1Kd3M7EoccfrIAC3ILaq3QmkywKBgQDfzmUJD9ivi3o6YSAAuTUvtRfiVDwWAVay\\noSur0Dla/hNa47SaCcdezcSHI9wO+cEIRfhzEd2T+c8dRv1yf7evUVOKvdUCDOOg\\ngP3oaFyvFbgoAqVOwTH2APPVcCafHvOoIvyVn4i61xTqp8fprehbfU+SDG25mgic\\ntJSxkCA0GQKBgQCmWUP2l3xbrNA3nu69lH01HjXKes7+XFpk41TvUxvxfUd2X7F/\\nP1RTfGmG2ebosW8rCKT2/QroBEJyE6AAcIAyh+7QKwDleYl1inzMAgEedLpTcj0E\\nL0uw1J6DO2/yHQ5wEwNFAfPAqGSPyyfShZT/mLfxE+08QoBW9ApSLcC8mwKBgFW7\\niaakBFySsHrGk+zTBdXFqGWR4QaI8r4w0Tra4+3AYIezrI5Jaq8dYchm6zhtYg2a\\nSCdEU74Ittc/R31iAWpOXBNMztkfON9WKm2p9L85MbdZ9BssFMho6v77HEBeKfZh\\nmKJ0X3s7Qw70wLb6YIUThrSqwCmWIPBumHtAe6WZAoGAJzRcXG8G1qi8vzqfadDZ\\nCZV2aFR+o0LkraHav5fqrywFsL2Us7XRZGlhsNmJLejRcjjGp3/CBYvENzpaZl6v\\nl631BTHfqW7nDmilUwD7glKnnQQNkkFemsfobgfqnItWV4P9yQuy16iSErZgW/xS\\nEHX3PNxnwIhamYnuGZNWLfY=\\n-----END PRIVATE KEY-----";
    FIREBASE_CLIENT_EMAIL = "firebase-adminsdk-fbsvc@proofflow-ai.iam.gserviceaccount.com";
    FIREBASE_CLIENT_ID = "103661462940074679632";
    FIREBASE_AUTH_URI = "https://accounts.google.com/o/oauth2/auth";
    FIREBASE_TOKEN_URI = "https://oauth2.googleapis.com/token";
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL = "https://www.googleapis.com/oauth2/v1/certs";
    FIREBASE_CLIENT_X509_CERT_URL = "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40proofflow-ai.iam.gserviceaccount.com";
    FIREBASE_UNIVERSE_DOMAIN = "googleapis.com";
    
    # Backend Port (this typically isn't an env var, but sometimes convenient to set)
    PORT = "5000"; # If your backend listens on this port

    # --- Frontend Environment Variables (prefixed with NEXT_PUBLIC_ for Next.js) ---
    NEXT_PUBLIC_BACKEND_URL = "http://localhost:5000/api"; # Adjust if your backend is deployed or uses a different port/path
    # Add other NEXT_PUBLIC_ variables your frontend needs
  };

  # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
  idx.extensions = [
    "angular.ng-template" # Example extension
    "esbenp.prettier-vscode" # Recommended for code formatting
    "dbaeumer.vscode-eslint" # Recommended for linting
    # Add other VS Code extensions you use for development
  ];

  # Enable previews and customize configuration
  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "start"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
          "--disable-host-check"
        ];
        manager = "web";
      };
      # You might want to add a separate preview for your backend if it's a different service
      # backend = {
      #   command = [ "npm" "run" "dev" ]; # Or whatever command starts your backend
      #   manager = "web";
      #   autoOpen = false;
      #   # targetPort = 5000; # If your backend uses a different port than the main web preview
      # };
    };
  };
}
