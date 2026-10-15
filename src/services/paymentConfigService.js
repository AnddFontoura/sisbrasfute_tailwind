import api from "@/services/api"

// Rótulos amigáveis para os meios de pagamento aceitos pelos gateways.
export const PAYMENT_METHOD_LABELS = {
  pix: "Pix",
  boleto: "Boleto",
  card: "Cartão",
}

// Rótulos amigáveis para os gateways disponíveis.
export const GATEWAY_LABELS = {
  efi: "Efí",
  inter: "Banco Inter",
  null: "Nenhum (desativado)",
}

// Rótulos amigáveis para os ambientes.
export const ENVIRONMENT_LABELS = {
  sandbox: "Sandbox (testes)",
  production: "Produção",
}

export const methodLabel = (method) => PAYMENT_METHOD_LABELS[method] ?? method
export const gatewayLabel = (gateway) => GATEWAY_LABELS[gateway] ?? gateway
export const environmentLabel = (env) => ENVIRONMENT_LABELS[env] ?? env

// Gateway de pagamento ativo + lista de gateways disponíveis.
export const fetchPaymentGateway = async () => {
  const { data } = await api.get("/admin/config/payment-gateway")
  return data
}

export const updatePaymentGateway = async (gateway) => {
  const { data } = await api.put("/admin/config/payment-gateway", {
    payment_gateway: gateway,
  })
  return data
}

// Para cada gateway: métodos suportados e métodos habilitados, mais o ativo.
export const fetchPaymentMethods = async () => {
  const { data } = await api.get("/admin/config/payment-methods")
  return data
}

export const updatePaymentMethods = async (gateway, methods) => {
  const { data } = await api.put("/admin/config/payment-methods", {
    gateway,
    methods,
  })
  return data
}

// Ambiente (sandbox/produção) por gateway, mais o ativo.
export const fetchPaymentEnvironment = async () => {
  const { data } = await api.get("/admin/config/payment-environment")
  return data
}

export const updatePaymentEnvironment = async (gateway, environment) => {
  const { data } = await api.put("/admin/config/payment-environment", {
    gateway,
    environment,
  })
  return data
}
