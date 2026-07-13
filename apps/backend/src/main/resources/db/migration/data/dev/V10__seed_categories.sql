/* =====================================================
   SEED FILE: V10__seed_categories.sql
   Generated at: 2026-07-13 20:07:32
   ===================================================== */

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES (1, 'Cameras', 'cameras', 'Digital Camera Bodies', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES (2, 'Lenses', 'lenses', 'Camera Lenses and Optics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES (3, 'Camera Supports', 'camera-supports', 'Camera Supports and Accessories', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES (4, 'Cables', 'cables', 'Camera Cables and Connectors', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES (5, 'Lens Supports', 'lens-supports', 'Lens Supports and Accessories', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES (6, 'Power Supplies', 'power-supplies', 'Power Supplies and Batteries', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SET FOREIGN_KEY_CHECKS = 1;
