// Intercept fetch to log all requests
(function() {
  const origFetch = window.fetch;
  window.fetch = function(...args) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || 'unknown';
    console.log('[FETCH]', url);
    return origFetch.apply(this, args).then(response => {
      if (!response.ok) {
        console.error('[FETCH ERROR]', response.status, url);
      }
      return response;
    }).catch(err => {
      console.error('[FETCH EXCEPTION]', url, err.message);
      throw err;
    });
  };
  
  // Also intercept XMLHttpRequest
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    console.log('[XHR]', method, url);
    return origOpen.call(this, method, url, ...rest);
  };
  
  // Catch all errors
  window.addEventListener('error', function(e) {
    console.error('[ERROR]', e.message, e.filename, e.lineno);
  });
  window.addEventListener('unhandledrejection', function(e) {
    console.error('[PROMISE ERROR]', e.reason);
  });
  
  console.log('[DEBUG] Fetch/XHR interceptor installed');
})();
