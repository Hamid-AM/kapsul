require "sidekiq/web" # Required to mount the Sidekiq Web UI

Rails.application.routes.draw do
  # Health check endpoint. Useful for monitoring and Kubernetes liveness/readiness probes.
  get "/up" => "rails/health#show", as: :rails_health_check

  # API routes are typically namespaced for versioning and organization.
  # We'll put Kapsul related APIs here.
  namespace :api do
    namespace :v1 do
      # Example: resources :kapsuls, only: [:create, :index, :show]
      # You'll define these controller actions later.
    end
  end

  # Sidekiq Web UI. Accessible at http://localhost:3000/sidekiq during development.
  # IMPORTANT: In a production environment, this endpoint MUST be secured with authentication
  # (e.g., HTTP basic auth, OAuth, or IP whitelisting) as it exposes sensitive job information.
  mount Sidekiq::Web => "/sidekiq"
end
