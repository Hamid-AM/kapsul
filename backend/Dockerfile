# syntax=docker/dockerfile:1
# check=error=true

# This Dockerfile is designed for production, not development. Use with Kamal or build'n'run by hand:
# docker build -t backend .
# docker run -d -p 80:80 -e RAILS_MASTER_KEY=<value from config/master.key> --name backend backend

# For a containerized dev environment, see Dev Containers: https://guides.rubyonrails.org/getting_started_with_devcontainer.html

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version
ARG RUBY_VERSION=3.4.4
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

#ENV DOCKER_BUILD_DATE=2025-06-14T19:25:00+02:00

# Rails app lives here
WORKDIR /kapsul/backend

# Install necessary system dependencies:
# build-essential: For compiling Ruby gems with native extensions.
# libpq-dev: PostgreSQL client development headers.
# nodejs, npm: For JavaScript runtime (e.g., if you later add JS processing in Rails).
# postgresql-client: PostgreSQL client tools for debugging.
# tzdata: Timezone data. #libgeos-dev \    libproj-dev \    gdal-bin \    libgdal-dev \
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libyaml-dev \
    nodejs \
    npm \
    postgresql-client \
    tzdata && \
    rm -rf /var/lib/apt/lists/*

ENV BUNDLE_PATH=/usr/local/bundle
ENV RAILS_ENV=development

# Copy Gemfile and Gemfile.lock first to leverage Docker's layer caching.
COPY Gemfile Gemfile.lock ./

# Install Ruby gems.
RUN bundle install --jobs=4

# Copy the rest of the application code.
COPY . .

# Expose port 3000 where Rails server will listen.
EXPOSE 3000

# Default command to run when the container starts.
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
#CMD ["/bin/bash"] # <--- CHANGE THIS LINE for debugging purposes

# Set production environment
#ENV RAILS_ENV="production" \
#    BUNDLE_DEPLOYMENT="1" \
#    BUNDLE_PATH="/usr/local/bundle" \
#    BUNDLE_WITHOUT="development"

# Throw-away build stage to reduce size of final image
#FROM base AS build

# Install packages needed to build gems
#RUN apt-get update -qq && \
#    apt-get install --no-install-recommends -y build-essential git libpq-dev libyaml-dev pkg-config && \
#    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install application gems
#COPY Gemfile Gemfile.lock ./
#RUN bundle install && \
#    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git

# Copy application code
# COPY . .




# Final stage for app image
#FROM base

# Copy built artifacts: gems, application
#COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
#COPY --from=build /rails /rails

# Run and own only the runtime files as a non-root user for security
#RUN groupadd --system --gid 1000 rails && \
#    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
#    chown -R rails:rails db log tmp
#USER 1000:1000

# Entrypoint prepares the database.
#ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Start server via Thruster by default, this can be overwritten at runtime
#EXPOSE 80
#CMD ["./bin/thrust", "./bin/rails", "server"]
