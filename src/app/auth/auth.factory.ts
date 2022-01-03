import { HttpClient } from '@angular/common/http';

import { CustomAuthService } from './custom-auth.service';

export function authFactory(httpClient: HttpClient) {
  return new CustomAuthService(httpClient);
}
