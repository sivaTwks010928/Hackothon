output "load_balancer_dns" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.resume_builder.dns_name
}

output "backend_ecr_repository_url" {
  description = "The URL of the backend ECR repository"
  value       = aws_ecr_repository.resume_backend.repository_url
}

output "frontend_ecr_repository_url" {
  description = "The URL of the frontend ECR repository"
  value       = aws_ecr_repository.resume_frontend.repository_url
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = aws_ecs_cluster.resume_builder.name
} 