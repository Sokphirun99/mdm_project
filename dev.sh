#!/bin/bash
# MDM Project Development Script

set -e

function show_help {
  echo "MDM Project Development Helper"
  echo ""
  echo "Usage:"
  echo "  ./dev.sh [command]"
  echo ""
  echo "Commands:"
  echo "  start       Start the development environment"
  echo "  stop        Stop the development environment"
  echo "  restart     Restart the development environment"
  echo "  logs        Show logs from all services"
  echo "  rebuild     Rebuild and restart the services"
  echo "  db-reset    Reset the database (CAUTION: destroys all data)"
  echo "  help        Show this help message"
  echo ""
}

case "$1" in
  start)
    echo "Starting development environment..."
    docker-compose -f docker-compose.dev.yml up -d
    echo "Services available at:"
    echo "  Backend API: http://localhost:3000"
    echo "  Admin Panel: http://localhost:8080"
    ;;
    
  stop)
    echo "Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down
    ;;
    
  restart)
    echo "Restarting development environment..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up -d
    ;;
    
  logs)
    echo "Showing logs (Ctrl+C to exit)..."
    docker-compose -f docker-compose.dev.yml logs -f
    ;;
    
  rebuild)
    echo "Rebuilding services..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml build
    docker-compose -f docker-compose.dev.yml up -d
    ;;
    
  db-reset)
    echo "WARNING: This will delete all data in the database!"
    read -p "Are you sure you want to proceed? (y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
      echo "Resetting database..."
      docker-compose -f docker-compose.dev.yml down
      docker volume rm mdm_project_db_data_dev || true
      docker-compose -f docker-compose.dev.yml up -d db
      echo "Waiting for database to start..."
      sleep 5
      docker-compose -f docker-compose.dev.yml up -d
      echo "Database reset complete."
    else
      echo "Database reset cancelled."
    fi
    ;;
    
  help|*)
    show_help
    ;;
esac
