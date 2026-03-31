use axum::{Json, Router, routing::get};

use crate::{
    config::load_site_profile,
    model::{HealthResponse, HomeProfile},
};

pub fn router() -> Router {
    Router::new()
        .route("/home/profile", get(get_home_profile))
        .route("/health", get(health_handler))
}

async fn get_home_profile() -> Json<HomeProfile> {
    Json(load_site_profile())
}

async fn health_handler() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok",
        version: env!("CARGO_PKG_VERSION"),
    })
}
