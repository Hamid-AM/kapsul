class CreateKapsuls < ActiveRecord::Migration[8.0]
  def change
    create_table :kapsuls do |t|
      t.string :title
      t.string :audio_s3_url, null: false
      t.integer :duration, null: false
      t.integer :visibility, default: 0
      t.datetime :expires_at
      t.datetime :opens_after
      # t.references :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
