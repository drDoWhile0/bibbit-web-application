-- CreateEnum
CREATE TYPE "ButtonCategory" AS ENUM ('feeling', 'need');

-- CreateEnum
CREATE TYPE "AcknowledgmentType" AS ENUM ('on_my_way', 'give_me_a_moment', 'i_hear_you');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communicators" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_communicator" (
    "id" TEXT NOT NULL,
    "caregiver_id" TEXT NOT NULL,
    "communicator_id" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "caregiver_communicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "button_boards" (
    "id" TEXT NOT NULL,
    "communicator_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "button_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buttons" (
    "id" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "image_url" TEXT,
    "category" "ButtonCategory" NOT NULL,
    "color" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "tts_text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buttons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "button_id" TEXT NOT NULL,
    "communicator_id" TEXT NOT NULL,
    "pressed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledged_at" TIMESTAMP(3),
    "acknowledged_by" TEXT,
    "acknowledgment_type" "AcknowledgmentType",
    "button_label" TEXT NOT NULL,
    "button_category" "ButtonCategory" NOT NULL,
    "button_image_url" TEXT,
    "notes" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "communicators" ADD CONSTRAINT "communicators_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_communicator" ADD CONSTRAINT "caregiver_communicator_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_communicator" ADD CONSTRAINT "caregiver_communicator_communicator_id_fkey" FOREIGN KEY ("communicator_id") REFERENCES "communicators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "button_boards" ADD CONSTRAINT "button_boards_communicator_id_fkey" FOREIGN KEY ("communicator_id") REFERENCES "communicators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buttons" ADD CONSTRAINT "buttons_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "button_boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_button_id_fkey" FOREIGN KEY ("button_id") REFERENCES "buttons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_communicator_id_fkey" FOREIGN KEY ("communicator_id") REFERENCES "communicators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_acknowledged_by_fkey" FOREIGN KEY ("acknowledged_by") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
