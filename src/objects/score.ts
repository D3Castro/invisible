const formatScore = (score: number) => `Score: ${score.toString()}`;

export default class Score extends Phaser.GameObjects.Text {
    private score: number;
    
    constructor(scene: Phaser.Scene, x: number, y: number, score: number, style: Phaser.Types.GameObjects.Text.TextStyle) {
        super(scene, x, y, formatScore(score), style);
        
        this.score = score;
	}

	setScore(score: number) {
		this.score  = score;
		this.updateScoreText();
	}

	add(points: number) {
		this.setScore(this.score + points);
	}

	updateScoreText() {
		this.setText(formatScore(this.score));
	}
}