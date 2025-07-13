import { loadPayPalScript } from './config.js';

export default function mount(container) {
  container.innerHTML = `
    <div class="paypal-integration">
      <h1>PayPal Integration</h1>
      <div class="paypal-controls">
        <div id="paypal-button-container"></div>
        <div class="transaction-status"></div>
      </div>
      <div class="settings-panel">
        <h3>Configuration</h3>
        <form id="paypal-settings">
          <div class="form-group">
            <label>Environment</label>
            <select name="environment">
              <option value="sandbox">Sandbox</option>
              <option value="production">Production</option>
            </select>
          </div>
          <button type="submit">Save Settings</button>
        </form>
      </div>
    </div>
  `;

  // Load PayPal script
  loadPayPalScript();

  // Handle settings
  document.getElementById('paypal-settings').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Save settings logic here
  });
}
