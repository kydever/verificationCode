const e = {},
  t = {
    emit: function (t, n) {
      const c = e[t];
      if (c && Object.keys(e[t]).length > 0)
        for (const e in c) !Object.hasOwnProperty.call(c, e) || c[e](n);
    },
  },
  n = {
    on: function (t, n, c = {}) {
      e[t] || (e[t] = {});
      let i = Object.keys(e[t]).length - 1;
      if (!c.dispatchKey) for (; e[t][i]; ) i++;
      e[t][c.dispatchKey || i] = n;
    },
    remove: function (t, n = {}) {
      const c = e[t];
      n.dispatchKey ? delete c[n.dispatchKey] : delete e[t];
    },
  };
var c = {
  eventEmitter: t,
  eventListener: n,
};
export { c as default, t as eventEmitter, n as eventListener };
