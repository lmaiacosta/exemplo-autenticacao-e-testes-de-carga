import { Component } from '@angular/core';

const keycloakConfig = {
  url: 'http://localhost:1001/realms/demo-realm/protocol/openid-connect/auth',
  logoutUrl: 'http://localhost:1001/realms/demo-realm/protocol/openid-connect/logout',
  clientId: 'frontend-client',
  redirectUri: 'http://localhost:1003/',
  responseType: 'code',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  loggedIn = false;
  username: string | null = null;
  userData: any = null;


  login(event: Event) {
    event.preventDefault();
    const params = new URLSearchParams({
      client_id: keycloakConfig.clientId,
      redirect_uri: keycloakConfig.redirectUri,
      response_type: keycloakConfig.responseType,
      scope: 'openid profile email',
    });
    window.location.href = `${keycloakConfig.url}?${params.toString()}`;
  }

  logout() {
    localStorage.removeItem('access_token');
    this.loggedIn = false;
    this.username = null;
    window.location.href = `${keycloakConfig.logoutUrl}?redirect_uri=${encodeURIComponent(keycloakConfig.redirectUri)}`;
  }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      this.exchangeCodeForToken(code);
    } else {
      const token = localStorage.getItem('access_token');
      if (token) {
        this.loggedIn = true;
        this.decodeToken(token);
      }
    }
  }

  async exchangeCodeForToken(code: string) {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: keycloakConfig.clientId,
      redirect_uri: keycloakConfig.redirectUri,
    });

    const response = await fetch('http://localhost:1001/realms/demo-realm/protocol/openid-connect/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      this.loggedIn = true;
      this.decodeToken(data.access_token);
      window.history.replaceState({}, document.title, keycloakConfig.redirectUri); // limpa o code da URL
    }
  }

  decodeToken(token: string) {
    // Decodifica o JWT para mostrar o usuário logado (apenas para exibição)
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.username = payload.preferred_username || payload.sub;
  }

  async callBackend() {
    const token = localStorage.getItem('access_token');
      alert('Token:' + token);

    if (!token) {
      alert('Faça login primeiro!');
      return;
    }
    const response = await fetch('http://localhost:1002/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    this.userData = data.user;
    alert(JSON.stringify(data, null, 2));
  }
}