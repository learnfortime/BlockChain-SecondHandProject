
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Iphone extends BaseModel {
	static init() {
		return super.init(
			{

				id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
				brand: { type: Sequelize.STRING, allowNull: false, defaultValue: Sequelize.literal('DEFAULT') },
				model: { type: Sequelize.STRING, allowNull: false, defaultValue: Sequelize.literal('DEFAULT') },
				price: { type: Sequelize.NUMBER, allowNull: false, defaultValue: Sequelize.literal('DEFAULT') },
				owner: { type: Sequelize.STRING, allowNull: false, defaultValue: Sequelize.literal('DEFAULT') },
				transactiontime: { type: Sequelize.DATE, defaultValue: Sequelize.literal('DEFAULT') },
				issold: { type: Sequelize.INTEGER, allowNull: false },
				imagepath: { type: Sequelize.STRING, defaultValue: Sequelize.literal('DEFAULT') }
			},
			{
				sequelize,

				tableName: "iphone",
				modelName: "iphone",
			}
		);
	}

	static listFields() {
		return [
			'id',
			'brand',
			'model',
			'price',
			'owner',
			Sequelize.literal('transactionTime AS transactiontime'),
			'issold',
			Sequelize.literal('imagePath AS imagepath')
		];
	}

	static viewFields() {
		return [
			'id',
			'brand',
			'model',
			'price',
			'owner',
			Sequelize.literal('transactionTime AS transactiontime'),
			'issold',
			Sequelize.literal('imagePath AS imagepath')
		];
	}

	static editFields() {
		return [
			'id',
			'brand',
			'model',
			'price',
			'owner',
			Sequelize.literal('transactionTime AS transactiontime'),
			'issold',
			Sequelize.literal('imagePath AS imagepath')
		];
	}


	static searchFields() {
		return [
			Sequelize.literal("id LIKE :search"),
			Sequelize.literal("brand LIKE :search"),
			Sequelize.literal("model LIKE :search"),
			Sequelize.literal("owner LIKE :search"),
		];
	}



}
Iphone.init();
export default Iphone;
