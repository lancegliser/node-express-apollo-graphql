# Auth API

Provides unified authentication handling across services.
Most services will simply receive an `Authorization: bearer` header and pass the details
along to this service. User facing API's require need OIDC integrations.
