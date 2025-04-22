/*
  Warnings:

  - You are about to drop the column `category` on the `movie` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `movie` table without a default value. This is not possible if the table is not empty.

*/

CREATE TEMPORARY TABLE temp_movie (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `release_date` DATETIME(3) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `rating` DECIMAL(5, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

insert into temp_movie (`id`, `created_at`, `updated_at`, `title`,  `description`, `release_date`,  `category`, `rating`) 
select `id`, `created_at`, `updated_at`, `title`,  `description`, `release_date`,  `category`, `rating` from `movie`; 


-- AlterTable
ALTER TABLE `movie` DROP COLUMN `category`,
    ADD COLUMN `category_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `category` (
    `id` VARCHAR(191) NOT NULL,
    `name` ENUM('SciFi', 'Action', 'Drama', 'Horror', 'Comedy') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert Categories

insert into `category` (`id`, `name`) select UUID(), replace(`m`.`category`, '-', '') from `temp_movie` `m` group by `m`.`category`;

-- Update Movie Table
UPDATE `movie` m
JOIN `temp_movie` tm ON m.id = tm.id
JOIN `category` c ON REPLACE(tm.category, '-', '') = c.name
SET m.category_id = c.id;

-- Alter table

ALTER TABLE `movie` MODIFY COLUMN `category_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `movie` ADD CONSTRAINT `movie_categoryId_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
